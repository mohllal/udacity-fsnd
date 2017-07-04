# Fresh Tomatoes
Fresh Tomatoes is a movie trailer one-page website where users can see my favorite movies and watch their trailers.

This is my project for the [Udacity's Full Stack Web Developer Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004) course [Programming Foundations with Python](https://www.udacity.com/course/programming-foundations-with-python--ud036).

Project name: Movie Trailer.

### Prerequisites:
This application needs [Python 2.7.12](https://www.python.org/downloads/release/python-2712/) to be installed on your machine.

### Files:
1. `media.py`:
	- Defines the Movie class which represents a movie and its related information.
2. `fresh_tomatoes.py`:
	- Contains styles and scripting for the HTML page. Provides methods to create movies tiles and open HTML page.
3. `entertainment_center.py`:
	- Provides a suite of tests. It contains six dummy Movie objects.

### Features:
  - Grid of movie tiles.
  - Each movie tile contains:
    - Movie's title.
    - Movie's release date.
    - Movie's rating on [IMDB](http://www.imdb.com/).
  - Clicking on a movie tile will:
    - Show movie's storyline.
    - Play movie's trailer video on [Youtube](https://www.youtube.com/).

### Usage:
To generate the HTML page, open your terminal and type:
```
python entertainment_center.py
```

### License:
This software is licensed under the [Modified BSD License](https://opensource.org/licenses/BSD-3-Clause).