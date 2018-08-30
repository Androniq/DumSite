/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Article from './Article';

const title = 'Article Page';

async function action({ fetch }, params) {
  const articlesResp = await fetch('/api/article/' + params[0], { method: 'GET' });
  var json = await articlesResp.json();
  console.info(json);
  console.info(articlesResp);
  return {
    chunks: ['Article'],
    title,
    component: (
      <Layout>
        <Article title={title} />
      </Layout>
    ),
  };
}

export default action;
