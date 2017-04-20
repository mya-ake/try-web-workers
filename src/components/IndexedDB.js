const template = `
<div>
  <h2>IndexedDB</h2>
  <button m-if="false" type="button" m-on:click="clickOpen">Open DB</button>

  <div>
    <h3>Create User</h3>
    <form m-on:submit.prevent="submitSave">
      <label>
        <span>Name: </span>
        <input type="text" maxlength="30" m-model="user.name">
      </label>
      <label>
        <span>Email: </span>
        <input type="email" maxlength="128" m-model="user.email">
      </label>
      <button type="submit">Create</button>
    </form>
  </div>
    <h3>Get User</h3>
    <form m-on:submit.prevent="submitGet">
      <input type="search" m-model="searchId" placeholder="id">
      <button type="submit">Get</button>
      <span m-if="!{{searchResult}}">Not Found</span>
    </form>
    <div>
      <span>Name: </span><span>{{gotUser.name}}</span>
    </div>
    <div>
      <span>Email: </span><span>{{gotUser.email}}</span>
    </div>
  <div>
  </div>
</div>
`;

export default template;