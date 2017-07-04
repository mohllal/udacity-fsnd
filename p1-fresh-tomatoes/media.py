class Movie:
    """This class represents a movie and its related information
    Attributes:
        title (str): This attribute represents movie's title.
        storyline (str): This attribute represents movie's storyline.
        poster_image_url (str): This attribute represents movie's poster
    image url.
        trailer_youtube_url (str): This attribute represents movie's trailer
    video url.
        release_date (str): This attribute represents movie's release date.
        rating (int): This attribute represents movie's rating on IMDB.
    """
    def __init__(self, move_title, movie_storyline,
                 movie_poster, movie_trailer,
                 movie_release_date, movie_rating):
        self.title = move_title
        self.storyline = movie_storyline
        self.poster_image_url = movie_poster
        self.trailer_youtube_url = movie_trailer
        self.release_date = movie_release_date
        self.rating = movie_rating
