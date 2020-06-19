import { BasicAuthConnection, Jira } from './rest-api';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

async function uploadAttachment() {
  const buf = await promises.readFile( "./src/index.ts" );
  const connection = new BasicAuthConnection( CREDENTIAL );
  const jira = new Jira( connection, new URL( 'http://localhost:8080' ) );

  try {
   await jira.addAttachment( 'SAMPLES-2', 'test.txt', buf );
  } catch( err ) {
    console.log( err.response.data );
  }
}

uploadAttachment();
// Axios.get( 'http://localhost:8060/rest-service/reviews-v1/details', {
//   headers: { 'Content-Type': 'application/json'}
// } ).then( data => {
//   // console.log(data.data);
// } )

// // https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/fisheye.html#rest-service-fe:search-v1:reviewsForChangeset:repository
// Axios.post( 'http://localhost:8060/rest-service-fe/search-v1/reviewsForChangeset/Practice',
//   'cs=2d2f7af5624ecf0770ffd71197833a05010d9995', {
//   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
// } ).then( res => {
//   console.log(res.data)
//   console.log(res.data.reviews[0].permaId)
// } ).catch( err => {
//   console.log(err)
// } );

// // https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/fisheye.html#rest-service-fe:search-v1:reviewsForChangeset:repository
// Axios.post( 'http://localhost:8060/rest-service-fe/search-v1/reviewsForChangeset/Practice',
//   'cs=2d2f7af5624ecf0770ffd71197833a05010d9995', {
//   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
// } ).then( res => {
//   console.log(res.data)
//   console.log(res.data.reviews[0].permaId)
// } ).catch( err => {
//   console.log(err)
// } );
