#!/usr/bin/env python
#
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2

hostname = 'localhost'
username = 'postgres'
password = '#########'
database = 'tournamentdb'


def connect():
    """Connects to the PostgreSQL database. Returns a database connection."""
    try:
        return psycopg2.connect(host=hostname, user=username,
                                password=password, dbname=database)
    except:
        print("Connection to the Database Failed")


def createTournament(name, end_date):
    """Creates a new tournament record.
    Args:
        name: Name of the tournament.
        end_date: End date of the tournament.
    """
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO tournament VALUES (%s, %s)", (name, end_date))
    connection.commit()
    connection.close()


def getTournamentId(name):
    """Gets the tournament's id.
        Args:
            name: Name of the tournament.
        """
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("SELECT id FROM tournament WHERE name = %s", (name,))
    connection.commit()
    id_ = int(cursor.fetchone()[0])
    connection.close()
    return id_


def deleteMatches(tournament_name):
    """Removes all the match records from the database
        that belong to a specific tournament.
    Args:
        tournament_name: Name of the tournament to which
            matches to be deleted are belong.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM match WHERE "
                   "match.tournamentId = %s", (tournament_id,))
    connection.commit()
    connection.close()


def deletePlayers(tournament_name):
    """Removes all the player records from the database
        that belong to a specific tournament.
    Args:
        tournament_name: Name of the tournament to which
            players to be deleted are belong.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM player WHERE "
                   "player.tournamentId = %s", (tournament_id,))
    connection.commit()
    connection.close()


def registerPlayer(name, birth_date, tournament_name):
    """Adds a player to the tournament database
        and registers it to a specific tournament record

    The database assigns a unique serial id number for the player.  (This
    should be handled by your SQL database schema, not in your Python code.)

    Args:
      name: The player's full name (need not be unique).
      birth_date: The player's date of birth.
      tournament_name: Name of the tournament to which
        player to be registered is belong.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO player VALUES (%s, %s, %s)",
                   (name, birth_date, tournament_id,))
    connection.commit()
    connection.close()


def countPlayers(tournament_name):
    """Returns the number of players currently
        registered to a specific tournament.
    Args:
        tournament_name: Name of the tournament to which
            players to be counted are belong.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM player WHERE "
                   "player.tournamentId = %s", (tournament_id,))
    connection.commit()
    result = cursor.fetchone()
    connection.close()
    return result[0]


def playerStandings(tournament_name):
    """Returns a list of the players registered to a
        specific tournament and their win records, sorted by wins.

    The first entry in the list should be the player in first place, or a player
    tied for first place if there is currently a tie.

    Args:
        tournament_name: Name of the tournament to which standing is belong

    Returns:
      A list of tuples, each of which contains (id, name, wins, matches):
        id: the player's unique id (assigned by the database)
        name: the player's full name (as registered)
        wins: the number of matches the player has won
        matches: the number of matches the player has played
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("SELECT firstTable.id, firstTable.name, firstTable.wins, secondTable.matches "
                   "FROM "
                   "(SELECT player.id, player.name, COUNT(match.winnerId) AS wins "
                   "FROM player "
                   "LEFT JOIN match ON player.id = match.winnerId AND player.tournamentId = match.tournamentId "
                   "WHERE player.tournamentId = %s GROUP BY player.id) AS firstTable "
                   "INNER JOIN "
                   "(SELECT player.id, player.name, COUNT(match.winnerId + match.loserId) AS matches "
                   "FROM player "
                   "LEFT JOIN match ON (player.id = match.winnerId OR player.id = match.loserId) AND "
                   "player.tournamentId = match.tournamentId "
                   "WHERE player.tournamentId = %s GROUP BY player.id) AS secondTable "
                   "ON firstTable.id = secondTable.id ORDER BY firstTable.wins DESC", (tournament_id, tournament_id,))
    connection.commit()
    result = [(int(row[0]), str(row[1]), int(row[2]), int(row[3]))
             for row in cursor.fetchall()]
    connection.close()
    return result


def reportMatch(winner, loser, tournament_name):
    """Records the outcome of a single match between two players.

    Args:
      winner:  the id number of the player who won.
      loser:  the id number of the player who lost.
      tournament_name: the name of the tournament to which match is belong.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO match VALUES (%s, %s, %s)",
                   (tournament_id, winner, loser,))
    connection.commit()
    connection.close()


def swissPairings(tournament_name):
    """Returns a list of pairs of players for the next round of a match.

    Assuming that there are an even number of players registered, each player
    appears exactly once in the pairings. Each player is paired with another
    player with an equal or nearly-equal win record, that is, a player adjacent
    to him or her in the standings.
    Args:
        tournament_name: Name of the tournament to which pairing is belong.
    Returns:
      A list of tuples, each of which contains (id1, name1, id2, name2).
        id1: the first player's unique id.
        name1: the first player's name.
        id2: the second player's unique id.
        name2: the second player's name.
    """
    tournament_id = getTournamentId(tournament_name)
    connection = connect()
    cursor = connection.cursor()
    cursor.execute("SELECT player.id, player.name, COUNT(match.winnerId) AS wins "
                   "FROM player "
                   "LEFT JOIN match ON player.id = match.winnerId "
                   "WHERE player.tournamentId = %s "
                   "GROUP BY player.id ORDER BY wins DESC", (tournament_id,))
    connection.commit()

    cursorList = cursor.fetchall()
    tupleList = []

    index = 0
    while index < len(cursorList) - 1:
        tempTuple = (int(cursorList[index][0]),
                     str(cursorList[index][1]),
                     int(cursorList[index + 1][0]),
                     str(cursorList[index + 1][1]))
        tupleList.append(tempTuple)
        index += 2
    connection.close()
    return tupleList
