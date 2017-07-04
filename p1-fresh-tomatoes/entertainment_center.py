import media
import fresh_tomatoes

# 'Toy Story' movie object
toy_story = media.Movie("Toy Story",
                        "A cowboy doll is profoundly threatened and "
                        "jealous when a new spaceman figure supplants "
                        "him as top toy in a boy's room.",
                        "https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg",  # NOQA
                        "https://www.youtube.com/watch?v=KYz2wyBy3kc",
                        "1995", 8.3)

# 'Avatar' movie object
avatar = media.Movie("Avatar",
                     "A paraplegic marine dispatched to the moon Pandora on "
                     "a unique mission becomes torn between following his "
                     "orders and protecting the world he feels is his home.",
                     "https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg",  # NOQA
                     "https://www.youtube.com/watch?v=5PSNL1qE6VY",
                     "2009", 7.8)

# 'Arrival' movie object
arrival = media.Movie("Arrival",
                      "When twelve mysterious spacecraft appear around "
                      "the world, linguistics professor Louise Banks is "
                      "tasked with interpreting the language of the "
                      "apparent alien visitors.",
                      "https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg",  # NOQA
                      "https://www.youtube.com/watch?v=tFMo3UJ4B4g",
                      "2016", 8.1)

# 'School of Rock' movie object
school_of_rock = media.Movie("School of Rock",
                             "After being kicked out of a rock band, Dewey "
                             "Finn becomes a substitute teacher of a strict "
                             "elementary private school, only to try and turn "
                             "it into a rock band.",
                             "https://upload.wikimedia.org/wikipedia/en/1/11/School_of_Rock_Poster.jpg",  # NOQA
                             "https://www.youtube.com/watch?v=XCwy6lW5Ixc",
                             "2003", 7.1)

# 'Midnight in Paris' movie object
midnight_in_paris = media.Movie("Midnight in Paris",
                                "While on a trip to Paris with his fiancee's "
                                "family, a nostalgic screenwriter finds "
                                "himself mysteriously going back to "
                                "the 1920s everyday at midnight.",
                                "https://upload.wikimedia.org/wikipedia/en/9/9f/Midnight_in_Paris_Poster.jpg",  # NOQA
                                "https://www.youtube.com/watch?v=BYRWfS2s2v4",
                                "2011", 7.7)

# 'Her' movie object
her = media.Movie("Her",
                  "A lonely writer develops an unlikely relationship "
                  "with an operating system designed "
                  "to meet his every need.",
                  "https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg",  # NOQA
                  "https://www.youtube.com/watch?v=WzV6mXIOVl4",
                  "2013", 8.0)

# List of all movies
movies = [toy_story, avatar, arrival, school_of_rock, midnight_in_paris, her]

# open_movies_page() function renders a list of movies into a HTML page
fresh_tomatoes.open_movies_page(movies)
