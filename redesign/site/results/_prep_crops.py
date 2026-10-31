# Results page crops (31 Oct rewrite): every pair re-cut from ~/Desktop/Boost Club Results Wall/panels so the person
# sits centred, at the same scale and head height in both halves. Crop + resize only (no retouching); the one
# exception is a flat site-night band above B02's before, where the source photo stops at his mouth.
# Landmarks: Apple Vision person mask + body pose + face boxes, cached by /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/vis.js
#   (osascript -l JavaScript vis.js <det dir> <panel.jpg>...) into /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/det/.
# Per-pair tweaks live in /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/{special,overrides,insets}.json. Check with /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/verify.py (before | after | 50% blend).
# Usage: cd /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx && python3 /private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/results/_prep_crops.py out/ [IDs]   then copy out/*.webp to results/img and sizes.
# Landmarks from Apple Vision (person mask + body pose, det/*.json), manual overrides in OV.
from PIL import Image, ImageDraw, ImageFont, ImageChops
import numpy as np, json, sys, os
R="/Users/Gabi/Desktop/Boost Club Results Wall/"
DET="/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/det/"; OUT=sys.argv[1] if len(sys.argv)>1 else "out/"
os.makedirs(OUT,exist_ok=True)
MAN={e["id"]:e for e in json.load(open(R+"manifest.json"))}
# manual landmark overrides: "<ID>-<before|after>": dict(cx=, top=, hip=, feet=)  (fractions of the panel)
OV=json.load(open("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/overrides.json")) if os.path.exists("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/overrides.json") else {}
# extra inset per panel side (l,t,r,b fractions) e.g. rounded-corner frames
INSET=json.load(open("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/insets.json")) if os.path.exists("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/insets.json") else {}
SPECIAL=json.load(open("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/special.json")) if os.path.exists("/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rx/special.json") else {}

def content_box(a):
    """strip uniform border rows/cols (white frames, black bars)"""
    g=a.mean(axis=2); H,W=g.shape
    def flat(v): return v.std()<7 and (v.mean()>228 or v.mean()<22)
    l,t,r,b=0,0,W,H
    while l<W*.2 and flat(g[t:b,l]): l+=1
    while r>W*.8 and flat(g[t:b,r-1]): r-=1
    while t<H*.2 and flat(g[t,l:r]): t+=1
    while b>H*.8 and flat(g[b-1,l:r]): b-=1
    return l,t,r,b

def marks(pid, im):
    W,H=im.size; d=json.load(open(f"{DET}{pid}.json"))
    m=np.array(Image.open(f"{DET}{pid}-mask.png").convert("L").resize((W,H)))>110
    P=max(d["pose"],key=len) if d["pose"] else {}
    g=lambda k:(P[k][0]*W,P[k][1]*H) if k in P and P[k][2]>.2 else None
    neck,root=g("neck_1_joint"),g("root")
    sh=[g("left_shoulder_1_joint"),g("right_shoulder_1_joint")]; sh=[s for s in sh if s]
    hips=[g("left_upLeg_joint"),g("right_upLeg_joint")]; hips=[s for s in hips if s]
    face=d["faces"][0] if d["faces"] else None
    xs=[p[0] for p in (neck,root) if p]
    if xs: cx=sum(xs)/len(xs)
    elif sh: cx=sum(s[0] for s in sh)/len(sh)
    elif face: cx=(face[0]+face[2]/2)*W
    else:
        ys,xx=np.nonzero(m); cx=xx.mean() if len(xx) else W/2
    hx=g("head_joint")[0] if g("head_joint") else (neck[0] if neck else cx)
    sw=abs(sh[0][0]-sh[1][0]) if len(sh)==2 else W*.25
    band=m[:,max(0,int(hx-sw*.45)):int(hx+sw*.45)+1]
    rows=np.nonzero(band.mean(axis=1)>.12)[0]
    top=rows[0] if len(rows) else (face[1]*H-face[3]*H*.4 if face else H*.05)
    hip=root[1] if root else (sum(h[1] for h in hips)/len(hips) if hips else None)
    fb=m[:,max(0,int(cx-sw)):int(cx+sw)+1]; rr=np.nonzero(fb.mean(axis=1)>.04)[0]
    feet=rr[-1] if len(rr) else None
    nk=neck[1] if neck else (sum(x[1] for x in sh)/len(sh) if sh else ((face[1]+face[3]*1.3)*H if face else None))
    r=dict(cx=cx/W,top=top/H,hip=hip/H if hip else None,neck=nk/H if nk else None,feet=feet/H if feet is not None else None)
    r.update(OV.get(pid,{}))
    return r

def load(i,k):
    im=Image.open(f"{R}panels/{i}-{k}.jpg").convert("RGB")
    l,t,r,b=content_box(np.asarray(im).astype(float))
    ins=INSET.get(f"{i}-{k}",INSET.get(i,[.008,.008,.008,.008]))
    W,H=im.size; l+=ins[0]*W; t+=ins[1]*H; r-=ins[2]*W; b-=ins[3]*H
    return im,(l,t,r,b)

def solve(i):
    global SOLVED_BOXES
    ims,boxes,mk=[],[],[]
    for k in ("before","after"):
        im,box=load(i,k); ims.append(im); boxes.append(box); mk.append(marks(f"{i}-{k}",im))
    sp=SPECIAL.get(i)
    if sp is not None and sp.get("mode")=="face":
        for k,(m,im) in enumerate(zip(mk,ims)):
            fs=json.load(open(f"{DET}{i}-{('before','after')[k]}.json"))["faces"]
            fs=sorted(fs,key=lambda f:-f[2]*f[3])[:sp.get("nf",1)]
            fh=sum(f[3] for f in fs)/len(fs); ft=min(f[1] for f in fs)
            m["cx"]=sum(f[0]+f[2]/2 for f in fs)/len(fs); m["top"]=ft-.5*fh; m["hip"]=m["top"]+fh*3.7
            if sp.get("nf",1)==1:   # body centre line from the person mask, a little below the face
                W_,H_=im.size; mm=np.array(Image.open(f"{DET}{i}-{('before','after')[k]}-mask.png").convert("L").resize((W_,H_)))>110
                r0,r1=int((ft+fh*1.3)*H_),int(min(1,ft+fh*3.2)*H_); ys,xs=np.nonzero(mm[r0:r1])
                if len(xs)>50: m["cx"]=float(np.median(xs))/W_
            m.update(OV.get(f"{i}-{('before','after')[k]}",{}))
        sp=None
    if sp is not None and set(sp)&{"pad","adj","mode"}: sp=None
    if sp is not None:   # no person logic: content boxes, matched height, common aspect, centred (or given cx)
        crops=[]
        a=min((b[2]-b[0])/(b[3]-b[1]) for b in boxes); a=min(a,sp.get("maxa",9))
        for (l,t,r,b),cx in zip(boxes,sp.get("cx",[None,None])):
            h=b-t; w=h*a; c=(l+r)/2 if cx is None else cx*ims[0].width
            x0=min(max(l,c-w/2),r-w); crops.append((x0,t,x0+w,b))
        SOLVED_BOXES=boxes
        return ims,crops,mk,"special"
    H=[im.height for im in ims]
    use="hip" if all(m["hip"] for m in mk) else ("neck" if all(m["neck"] for m in mk) else None)
    if use is None: raise SystemExit(f"{i}: no common landmark {mk}")
    u=[(m[use]-m["top"])*h for m,h in zip(mk,H)]
    if use=="neck": u=[x*2.6 for x in u]
    org=[(m["cx"]*im.width,m["top"]*im.height) for m,im in zip(mk,ims)]
    adj=(SPECIAL.get(i) or {}).get("adj")
    if adj:  # manual nudge of the AFTER panel: scale factor, shifts in units of u
        u[1]*=adj.get("s",1); org[1]=(org[1][0]+adj.get("dx",0)*u[1],org[1][1]+adj.get("dy",0)*u[1])
    xl=max((b[0]-o[0])/s for b,o,s in zip(boxes,org,u)); xr=min((b[2]-o[0])/s for b,o,s in zip(boxes,org,u))
    yt=max((b[1]-o[1])/s for b,o,s in zip(boxes,org,u)); yb=min((b[3]-o[1])/s for b,o,s in zip(boxes,org,u))
    top=max(yt,-.13)
    if (SPECIAL.get(i) or {}).get("pad"):
        top=max(-.13,min((b[1]-o[1])/s for b,o,s in zip(boxes,org,u)))
    ft=[m["feet"]*im.height for m,im in zip(mk,ims)] if all(m["feet"] for m in mk) else None
    if ft and all(f < b[3]-im.height*.02 for f,b,im in zip(ft,boxes,ims)):
        fe=max((f-o[1])/s for f,o,s in zip(ft,org,u)); yb=min(yb,fe+.09)
    half=min(-xl,xr); hgt=yb-top
    half=min(half,hgt*(SPECIAL.get(i) or {}).get('maxa',.80)/2)
    crops=[(o[0]-half*s,o[1]+top*s,o[0]+half*s,o[1]+yb*s) for o,s in zip(org,u)]
    SOLVED_BOXES=boxes
    return ims,crops,mk,use

def run(ids):
    meta={}
    for i in ids:
        try: ims,crops,mk,how=solve(i)
        except SystemExit as e: print("SKIP",e); continue
        a=(crops[0][2]-crops[0][0])/(crops[0][3]-crops[0][1])
        Hs=min(1400,round(min(c[3]-c[1] for c in crops))); Ws=round(Hs*a)
        for im,c,k,b in zip(ims,crops,("before","after"),SOLVED_BOXES):
            if c[1]<b[1]-1:   # padded: a flat site-night band where the source has no picture (never painted over the photo)
                pad=round(b[1]-c[1]); cc=(round(c[0]),round(b[1]),round(c[2]),round(c[3]))
                body=im.crop(cc); o=Image.new("RGB",(body.width,body.height+pad),(7,30,23)); o.paste(body,(0,pad))
                o=o.resize((Ws,Hs),Image.LANCZOS)
            else:
                o=im.crop(tuple(round(v) for v in c)).resize((Ws,Hs),Image.LANCZOS)
            o.save(f"{OUT}{i}-{k}.webp",quality=84,method=6)
            th=720 if Hs>720 else Hs
            o.resize((round(th*a),th),Image.LANCZOS).save(f"{OUT}{i}-{k}-s.webp",quality=78,method=6)
        meta[i]=dict(w=Ws,h=Hs,how=how)
        print(i,how,Ws,Hs,round(a,3),[round(v,3) for v in (mk[0]["cx"],mk[1]["cx"],mk[0]["top"],mk[1]["top"])])
    return meta

if __name__=="__main__":
    # every manifest pair except Gabi's own (A17, E06), E03 (same photos as A07), D14 + A09 (a small child in frame)
    ids=sys.argv[2:] or [e for e in MAN if e not in ("A17","E06","E03","D14","A09")]
    meta=run(ids)
    old=json.load(open(OUT+"sizes.json")) if os.path.exists(OUT+"sizes.json") else {}
    old.update(meta); json.dump(old,open(OUT+"sizes.json","w"))
