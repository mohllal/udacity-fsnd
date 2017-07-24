# Swiss Tournament
Swiss Tournament is the backend (Database and Python wrapper code) for a Swiss-style tournament system.

[From Wikipedia](https://en.wikipedia.org/wiki/Swiss-system_tournament):  A Swiss-system tournament is a tournament which uses a non-elimination format.  There are several rounds of competition, but considerably fewer rounds than in a round-robin tournament, so each competitor (team or individual) does not play every other competitor.  Competitors meet one-to-one in each round and are paired using a predetermined set of rules designed to ensure that in each round, each pair of competitors are as close in the standings as possble subject to not having already played a match together.  The winner is the competitor with the highest aggregate points earned in all rounds.

This is my project for the [Udacity's Full Stack Web Developer Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004) course [Intro to Relational Databases](https://www.udacity.com/course/intro-to-relational-databases--ud197).

Project name: Tournament Planner.

### Prerequisites:
The database schema was written in PostgreSQL, and the wrapper language used to access the database is Python.  So, to use this code as-is, you should ensure you have the following installed on your machine:
1. [Python 2.7](https://www.python.org/downloads/)
2. [PostgreSQL](https://www.postgresql.org/download/)


### Files:
1. tournament.sql:
	- Defines the schema for a PostgresSQL database that holds information about multiple Swiss-style tournaments.
2. tournament.py:
	- Provides convenient methods to manage player registrations, match reporting, rankings, and pairings for the next round of a tournament.
3. tournament_test.py:
	- Provides a suite of tests to ensure tournament.py and tournament.sql correclty manage registration, reporting, rankings, and pairings for multiple Swiss-style tournaments.

## Usage:
To use this code to manage a Swiss-style tourament, you should:
1. Download and unzip all of the files in this repo into the same directory.
2. From the command line, navigate to the ```p4-swiss-tournament``` directory into which you unzipped all the files from this repo.
3. Start the psql command line client, which talks to the PostgreSQL database, by typing ```psql``` and pressing enter.
4. Create the database by typing ```\i tournament.sql``` into the psql interpreter and pressing enter.

Now the database has been created, and you can import all the functions in tournament.py file and use those functions to create and register players, create tournaments, report matches, view standings, and pair players for the next round of a tournament.

**Note:** You have to change 'password' variable's value in the tournament.py file to your PostgreSQL server password in order to connect to it. This [blog](http://pgsnake.blogspot.com.eg/2010/07/postgresql-passwords-and-installers.html) is explaining what the different passwords are used for, and how to overcome common problems such as resetting them.

If you want to see a working example of the code working without writing your own tournament, you can do the following (assuming you are still in the psql interpreter and within the directory to which you unzipped all the files):

1. type ```\q``` and press enter to exit the psql interpreter.
2. Type ```python tournament_test.py``` to run the test suite.

### License:
This software is licensed under the [Modified BSD License](https://opensource.org/licenses/BSD-3-Clause).