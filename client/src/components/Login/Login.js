import React from "react";

const Login = () => {
  return (
    <div className="container">
      <form class="row g-3">
        <div class="col-md-12">
          <label for="email" class="form-label">
            Email
          </label>
          <input type="email" class="form-control" id="email" name="email" />
        </div>
        <div class="col-md-12">
          <label for="password" class="form-label">
            Password
          </label>
          <input type="password" class="form-control" id="password" />
        </div>
        <div class="list-group col-md-12">
          <button
            type="button"
            class="list-group-item list-group-item-action active"
          >
            Active item
          </button>
          <button type="button" class="list-group-item list-group-item-action">
            Item
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action disabled"
          >
            Disabled item
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
