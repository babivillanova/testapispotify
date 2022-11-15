import './App.css';
import { useEffect , useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';


const CLIENT_ID = "e70f67cae4f34f7587001244f470c159";
  const CLIENT_SECRET = "6891c60d3e03458cb46c284a526c47fb";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";


function App() {

    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  ////serach function
  async function search() {
    console.log("searching for " + searchInput); 

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }

  }
  var artistID = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist", searchParameters)
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id })

    console.log("artistID: " + artistID);

    var returnedAlbums = await fetch("https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&limit=50", searchParameters)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        setAlbums(data.items);
      })
}
  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size='lg'>
          <FormControl
            placeholder="Search for a song"
            type='input'
            onKeyPress={event => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={event => {setSearchInput(event.target.value)}}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map( (album, i) => {
            return (
              <Card>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
                </Card.Body>
            </Card>
            )}
          )}
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
