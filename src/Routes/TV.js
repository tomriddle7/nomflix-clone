import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { tvApi } from "api";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";

const Container = styled.div`
  padding: 20px;
`;

const TV = () => {
  const [loading, setLoading] = useState(true);
  const [topRated, settopRated] = useState([]);
  const [popular, setpopular] = useState([]);
  const [airingToday, setairingToday] = useState([]);
  const [error, seterror] = useState("");
  
  useEffect(() => {
    const getTVArr = async () => {
      try {
        const {
            data: { results: topRated }
          } = await tvApi.topRated();
          const {
            data: { results: popular }
          } = await tvApi.popular();
          const {
            data: { results: airingToday }
          } = await tvApi.airingToday();
        
        settopRated(topRated);
        setpopular(popular);
        setairingToday(airingToday);
      } catch (e) {
        seterror("Can't find TV information.");
      } finally {
        setLoading(false);
      }
    };
    getTVArr();
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
        {topRated && topRated.length > 0 && (
          <Section title="Top Rated Shows">
            {topRated.map(show => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={show.first_air_date.substring(0, 4)}
              />
            ))}
          </Section>
        )}
        {popular && popular.length > 0 && (
          <Section title="Popular Shows">
            {popular.map(show => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={show.first_air_date.substring(0, 4)}
              />
            ))}
          </Section>
        )}
        {airingToday && airingToday.length > 0 && (
          <Section title="Airing Today">
            {airingToday.map(show => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={show.first_air_date.substring(0, 4)}
              />
            ))}
          </Section>
        )}
        {error && <Message color="#e74c3c" text={error} />}
      </Container>
  );
}

export default TV;
