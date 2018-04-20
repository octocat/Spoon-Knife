```flow
st=>start: Unique sequences
thred=>operation: Threshold by bootstrapping
thredcon=>condition: Abundance
					> threshold
re=>inputoutput: Reliable sequences
un=>inputoutput: Unreliable sequences
otupick=>operation: OTU delineation
remapcon=>condition: Similarity to obtained
                     OTUs > threshold
remap=>operation: Remap to obtained OTUs
discard=>end: Discard
otu=>inputoutput: Obtained OTUs


e=>end: Final results

st->thred->thredcon
thredcon(yes)->otupick->e
thredcon(no)->remapcon(yes)->remap->e
remapcon(no)->discard


```
