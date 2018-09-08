
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
import EditArgument from './EditArgument';

async function action({ fetch }, params) {
    var argumentId = params[0];
    if (!argumentId)
    {
      // redirect 404
      return null;
    }
    var isNew = argumentId === 'new';
    var fetchApi = isNew ? `/api/getNewArgument/${params[1]}` : `/api/getArgument/${argumentId}`;
    var editArgumentResp = await fetch(fetchApi, { method: 'GET' });
    var data = await editArgumentResp.json();
  return {
    chunks: ['editArgument'],
    title: isNew ? 'Новий аргумент' : 'Редагування аргументу',
    component: (
      <Layout>
        <EditArgument data={data} fetch={fetch} />
      </Layout>
    ),
  };
}

export default action;
