import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { moviesApi, tvApi } from "api";
import Loader from "Components/Loader";

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 50px;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bgImage});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
  height: 100%;
`;

const Cover = styled.div`
  width: 30%;
  background-image: url(${props => props.bgImage});
  background-position: center center;
  background-size: cover;
  height: 100%;
  border-radius: 5px;
`;

const Data = styled.div`
  width: 70%;
  margin-left: 10px;
`;

const Title = styled.h3`
  font-size: 32px;
`;

const ItemContainer = styled.div`
  margin: 20px 0;
`;

const Item = styled.span``;

const Divider = styled.span`
  margin: 0 10px;
`;

const Overview = styled.p`
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
  width: 50%;
`;

const Detail = (
  {
    match: {params: { id }},
    history: { push },
    location: { pathname }
  }) => {
  const [loading, setLoading] = useState(true);
  const [result, setresult] = useState();
  const [isMovie, setisMovie] = useState(pathname.includes("/movie/"));
  const [error, seterror] = useState("");
  
  useEffect(() => {
    const getDetailArr = async () => {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return push("/");
      }
      try {
        if (isMovie) {
          const { data } = await moviesApi.movieDetail(parsedId);
          setresult(data);
        } else {
          const { data } = await tvApi.showDetail(parsedId);
          setresult(data);
        }
      } catch (e) {
        seterror("Can't find anything.");
      } finally {
        setLoading(false);
      }
    };
    getDetailArr();
  }, []);

  return loading ? (
    <>
      <Helmet>
        <title>Loading | Nomflix</title>
      </Helmet>
      <Loader />
    </>
  ) : (
    <Container>
      <Helmet>
        <title>
          {result.title ? result.title : result.name}{" "}
          | Nomflix
        </title>
      </Helmet>
      <Backdrop
        bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`}
      />
      <Content>
        <Cover
          bgImage={
            result.poster_path
              ? `https://image.tmdb.org/t/p/original${result.poster_path}`
              : require("assets/noPosterSmall.png")
          }
        />
        <Data>
          <Title>
            {result.title
              ? result.title
              : result.name}
          </Title>
          <ItemContainer>
            <Item>
              {result.release_date
                ? result.release_date.substring(0, 4)
                : result.first_air_date.substring(0, 4)}
            </Item>
            <Divider>•</Divider>
            <Item>
              {result.runtime ? result.runtime : result.episode_run_time[0]} min
            </Item>
            <Divider>•</Divider>
            <Item>
              {result.genres &&
                result.genres.map((genre, index) =>
                  index === result.genres.length - 1
                    ? genre.name
                    : `${genre.name} / `
                )}
            </Item>
            {result.imdb_id &&
            result.imdb_id.length > 0 && (
            <>
              <Divider>•</Divider>
              <Item>
                <a href={`https://www.imdb.com/title/${result.imdb_id}/`}target="_blank" rel="noopener noreferrer">
                </a>
              </Item>
            </>
            )}
          </ItemContainer>
          <Overview>{result.overview}</Overview>
        </Data>
      </Content>
    </Container>
  );
}

export default Detail;
