import sys,glob
from PIL import Image
S='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/'
for pg in sys.argv[1:]:
    fs=sorted(glob.glob(f'{S}{pg}_d_*.jpg'))
    ims=[Image.open(f).resize((640,400)) for f in fs]; cols=2; rows=(len(ims)+1)//2
    X=Image.new('RGB',(cols*646-6,rows*406-6),'red')
    for i,im in enumerate(ims): X.paste(im,((i%2)*646,(i//2)*406))
    X.save(f'{S}sheet_{pg}_d.jpg',quality=72)
    fs=sorted(glob.glob(f'{S}{pg}_m_*.jpg'))
    ims=[Image.open(f).resize((260,563)) for f in fs]
    X=Image.new('RGB',(len(ims)*266-6,563),'red')
    for i,im in enumerate(ims): X.paste(im,(i*266,0))
    X.save(f'{S}sheet_{pg}_m.jpg',quality=72)
