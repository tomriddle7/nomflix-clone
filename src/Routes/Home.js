import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { moviesApi } from "api";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";

const Container = styled.div`
  padding: 20px;
`;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [nowPlaying, setnowPlaying] = useState([]);
  const [upcoming, setupcoming] = useState([]);
  const [popular, setpopular] = useState([]);
  const [error, seterror] = useState("");
  
  useEffect(() => {
    const getHomeArr = async () => {
      try {
        const {
            data: { results: nowPlaying }
          } = await moviesApi.nowPlaying();
          const {
            data: { results: upcoming }
          } = await moviesApi.upcoming();
          const {
            data: { results: popular }
          } = await moviesApi.popular();
        
        setnowPlaying(nowPlaying);
        setupcoming(upcoming);
        setpopular(popular);
      } catch (e) {
        seterror("Can't find movie information.");
      } finally {
        setLoading(false);
      }
    };
    getHomeArr();
  }, []);

  return loading ? (
    <>
      <Helmet>
        <title>Movies | Nomflix</title>
      </Helmet>
      <Loader />
    </>
  ) : (
    <Container>
      <Helmet>
        <title>Movies | Nomflix</title>
      </Helmet>
      {nowPlaying && nowPlaying.length > 0 && (
        <Section title="Now Playing">
          {nowPlaying.map(movie => (
            <Poster
              key={movie.id}
              id={movie.id}
              imageUrl={movie.poster_path}
              title={movie.original_title}
              rating={movie.vote_average}
              year={movie.release_date.substring(0, 4)}
              isMovie={true}
            />
          ))}
        </Section>
      )}
      {upcoming && upcoming.length > 0 && (
        <Section title="Upcoming Movies">
          {upcoming.map(movie => (
            <Poster
              key={movie.id}
              id={movie.id}
              imageUrl={movie.poster_path}
              title={movie.original_title}
              rating={movie.vote_average}
              year={movie.release_date.substring(0, 4)}
              isMovie={true}
            />
          ))}
        </Section>
      )}
      {popular && popular.length > 0 && (
        <Section title="Popular Movies">
          {popular.map(movie => (
            <Poster
              key={movie.id}
              id={movie.id}
              imageUrl={movie.poster_path}
              title={movie.original_title}
              rating={movie.vote_average}
              year={movie.release_date.substring(0, 4)}
              isMovie={true}
            />
          ))}
          {error && <Message color="#e74c3c" text={error} />}
        </Section>
      )}
    </Container>
  );
}

export default Home;
