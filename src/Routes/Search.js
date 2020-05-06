import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { moviesApi, tvApi } from "api";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  margin-bottom: 50px;
  width: 100%;
`;

const Input = styled.input`
  all: unset;
  font-size: 28px;
  width: 100%;
`;

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [movieResults, setmovieResults] = useState([]);
  const [tvResults, settvResults] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [error, seterror] = useState("");
  
  const handleSubmit = event => {
    event.preventDefault();
    setsearchTerm(searchTerm);
    if (searchTerm !== "") {
      searchByTerm();
    }
  };

  const updateTerm = event => {
    const {
      target: { value }
    } = event;
    setsearchTerm(value);
  };

  const searchByTerm = async () => {
    setsearchTerm(searchTerm);
    setLoading(true);
    try {
      const {
        data: { results: movieResults }
      } = await moviesApi.search(searchTerm);
      const {
        data: { results: tvResults }
      } = await tvApi.search(searchTerm);
      setmovieResults(movieResults);
      settvResults(tvResults);
    } catch (e) {
      seterror("Can't find results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
    <Helmet>
      <title>Search | Nomflix</title>
    </Helmet>
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="Search Movies or TV Shows..."
        value={searchTerm}
        onChange={updateTerm}
      />
    </Form>
    {loading ? (
      <Loader />
    ) : (
      <>
        {movieResults && movieResults.length > 0 && (
          <Section title="Movie Results">
            {movieResults.map(movie => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.title}
                rating={movie.vote_average}
                year={movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {tvResults && tvResults.length > 0 && (
          <Section title="TV Show Results">
            {tvResults.map(show => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.name}
                rating={show.vote_average}
                year={show.first_air_date ? show.first_air_date.substring(0, 4) : ""}
              />
            ))}
          </Section>
        )}
        {error && <Message color="#e74c3c" text={error} />}
        {tvResults &&
          movieResults &&
          tvResults.length === 0 &&
          movieResults.length === 0 && (
            <Message text="Nothing found" color="#95a5a6" />
          )}
      </>
    )}
  </Container>
  );
}

export default Search;
