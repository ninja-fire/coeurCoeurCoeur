import uuidv4 from "uuid/v4";

const Connector = {

  getId(){

    if (localStorage.getItem('id') === null) {

      localStorage.setItem('id', uuidv4());

    }

    return localStorage.getItem('id');

  }
  // todo move http request
};

export default Connector;
