import components from './../../components/exports.js';
import utils from './../utils.js';


const API = Object.freeze({
  BASE_URL: 'https://79rp01r1p1.execute-api.ap-northeast-1.amazonaws.com/v1',
});

const component = {
  template: utils.buildTemplate(components.Fetch),
  methods: {
    clickAction() {
      console.log('fetch api');
      fetch(`${API.BASE_URL}/tests/cache`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })
        .then((response) => {
          console.info(response.status);
          return response.json();
        })
        .then((json) => {
          console.log(json);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};

export default component;