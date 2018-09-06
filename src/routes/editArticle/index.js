
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
import EditArticle from './EditArticle';

async function action({ fetch }, params) {
    var articleId = params[0];
    let article = null;
    if (articleId && articleId !== 'new')
    {
        const editArticleResp = await fetch(`/api/getArticle/${params[0]}`, { method: 'GET' });
        article = await editArticleResp.json();
    }
  return {
    chunks: ['editArticle'],
    title: article ? ('Редагування: ' + article.PageTitle) : 'Нова стаття',
    component: (
      <Layout>
        <EditArticle data={article || {}} />
      </Layout>
    ),
  };
}

export default action;
