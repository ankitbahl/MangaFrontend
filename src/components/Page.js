import React from 'react'
import $ from 'jquery'

// const SERVER_URL = 'https://18.221.133.190:4567';
const SERVER_URL = 'http://localhost:4567';
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
    this.updateResults= this.updateResults.bind(this)

  }

  componentDidMount() {
    $(document).keypress(function(e){
      if (e.which == 13){
        $("#search").click();
      }
    });
  }

  downloadManga(title) {
    const changeProgress = (amount) => {
      let elem = document.getElementById("progressBar");
      let width = amount;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1 + '%';
    };

    const getMangaFile = () => {
      document.getElementById("progress").style.display = "block";
      let http = new XMLHttpRequest();
      const url = `${SERVER_URL}/progress`;
      http.open("GET", url);
      http.onload = function(e) {
        if (http.status === 200 && http.readyState === 4) {
          console.log(http.responseText);
          if (http.responseText != 'done') {
            changeProgress(parseInt(http.responseText));
            setTimeout(getMangaFile, 2000);
          } else {
            http = new XMLHttpRequest();
            const url = `${SERVER_URL}/manga`;
            http.open("GET", url);
            http.responseType = 'arraybuffer'
            http.onload = function(e) {
              if (http.status === 200 && http.readyState === 4) {
                let blob = typeof File === 'function'
                  ? new File([http.response], 'output.zip')
                  : new Blob([http.response]);
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'output.zip';
                link.click();
                document.getElementById("progress").style.display = "none";
              }
            };
            http.send();
          }
        }
      };
      http.send();
    };

    const manga_url = this.state.results.filter((result) => {return result.title === title})[0].url;
    const arg1 = document.getElementById(`${title}_start`).value;
    const arg2 = document.getElementById(`${title}_end`).value;
    const http = new XMLHttpRequest();
    const url = `${SERVER_URL}/manga?url=${encodeURI(manga_url)}&arg1=${encodeURI(arg1)}&arg2=${encodeURI(arg2)}&name=${encodeURI(title)}`;
    http.open("POST", url);
    http.onload = function(e) {
      if (http.status === 200 && http.readyState === 4) {
        console.log(http.responseText);
        if (http.responseText === 'job in progress') {
          alert('job already in progress!')
        } else if (http.responseText === 'bad input!') {
          alert('bad input!')
        } else {
          getMangaFile();
        }
      }
    };
    http.send();
  }

  updateResults(results) {
    this.setState({results});
  }

  results() {
    return (<table><tbody>

      {this.state.results.map((result) => {
        return <tr key={result.title}>
          <th>
            <img src={result.pic} />
          </th>
          <th>
            {result.title}
          </th>
          <th>
            <input id={`${result.title}_start`} type="text" placeholder="Start Chapter"/>
          </th>
          <th>
            <input id={`${result.title}_end`} type="text" placeholder="End Chapter"/>
          </th>
          <th>
            <button onClick={() => {this.downloadManga(result.title)}}>Download</button>
          </th>
        </tr>
      })}
    </tbody></table>);
  }

  render() {
    let search = () => {
      let searchTerm = document.getElementById('input').value;
      console.log('searching for ' + searchTerm);
      const http = new XMLHttpRequest();
      const url = `${SERVER_URL}/manga-names/${encodeURI(searchTerm)}`;
      http.open("GET", url);
      http.onload = function(e) {
        if (http.status === 200 && http.readyState === 4) {
          this.updateResults(JSON.parse(http.responseText))
        }
      }.bind(this);
      http.send();
    };

    return <div>
      <h1>Manga Downloader</h1>
      <div className="content">
        <input id="input" type="text" placeholder="Search Manga"/>
        <button id="search" onClick={search}>Search</button>
        <div id="progress">
          <div id="progressBar">0%</div>
        </div>
        {this.results()}
      </div>
    </div>
  }
}

export default Page;