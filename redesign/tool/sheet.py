import sys,glob
from PIL import Image
pat,out,cols,s=sys.argv[1],sys.argv[2],int(sys.argv[3]),float(sys.argv[4])
fs=sorted(glob.glob(pat)); ims=[Image.open(f) for f in fs]; w,h=ims[0].size; W,H=int(w*s),int(h*s)
rows=(len(ims)+cols-1)//cols; sh=Image.new('RGB',(cols*W+(cols-1)*6,rows*H+(rows-1)*6),'white')
for i,im in enumerate(ims): sh.paste(im.resize((W,H)),((i%cols)*(W+6),(i//cols)*(H+6)))
sh.save(out,quality=74); print(out,len(ims),sh.size)
