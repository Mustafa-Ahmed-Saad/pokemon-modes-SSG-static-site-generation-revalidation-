/* eslint-disable @next/next/no-img-element */
// this line number 1 to skip worning of img that say
// Do not use `<img>` element. Use `<Image />` from `next/image` instead
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Details.module.css';

export async function getStaticPaths() {
  const resp = await fetch('https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json');
  const pokemon = await resp.json();

  return {
    paths: pokemon.map((pokemon) => ({
      params: {
        id: pokemon.id.toString(),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const resp = await fetch(`https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${context.params.id}.json`);
  return {
    props: {
      pokemon: await resp.json(),
    },
    // every 30 second the page will update to cover the change in server and database
    revalidate: 30,
  };
}

export default function Details({ pokemon }) {
  return (
    <div>
      <Head>
        <title>{pokemon.name}</title>
      </Head>
      <div>
        <Link href="/">
          <a>Back To Home</a>
        </Link>
      </div>
      <div className={styles.layout}>
        <div>
          <img className={styles.picture} src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${pokemon.image}`} alt={pokemon.name.english} />
        </div>
        <div>
          <div className={styles.name}>{pokemon.name}</div>
          <div className={styles.type}>{pokemon.type.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
