import React from 'react';
import { Route, IndexRoute } from 'react-router';
import UserLogin from './components/users/login_users';
import Posts from './components/Posts';

import App from './App';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={UserLogin} />
        <Route path="posts" component={Posts} />
    </Route>
);