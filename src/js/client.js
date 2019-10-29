const url = 'http://127.0.0.1:5000/graphql';
const client = {
    login: (success) => queryGraphQL(
        `\
query {
  getKernelInstance {
    id
  }
}\
`,
        success
    ),
    logout: (success, data) => queryGraphQL(
        `\
query {
  closeKernelInstance(id: "${data.id}") {   
    output
  }
}\
`,
        success
    ),
    execute: (success, data) => queryGraphQL(
        `\
query {
  execute(id: "${data.id}") {
    python(code: ${JSON.stringify(`${data.code}`)}) {
      result {
        output
        error
      }
    }
  }
}\
`,
        success
    ),
};
export default client;

function queryGraphQL(query, success) {
    console.log(query);
    return fetch(url, {
        method: 'POST',
        body: query,
        headers: {
            'Content-Type': 'application/graphql',
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(success);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        console.log(error);
        throw error;
    }
}

const parseJSON = (response) => response.json();
