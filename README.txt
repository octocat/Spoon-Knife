# MuDoPy

MuDoPy is a Python library for downloading songs.

Syntext to download song

import mudopy

mudopy.set_path("path to chromedriver\chromedriver.exe") #one for one time
mudopy.download_path(r"your download path") #only for one time
mudopy("song name","artist name(optional)")

#if you not enter download path then library will downloaded into cwd


## Installation

```bash
pip install mudopy
```

## Usage

```python
import mudopy
mudopy.download_path(r"your download path") #only for one time
mudopy.download("Song name","name of artist")#Will download the song in download_path


```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/
