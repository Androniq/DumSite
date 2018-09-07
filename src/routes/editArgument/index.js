
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
    let argument = null;
    if (argumentId && argumentId !== 'new')
    {
        const editArgumentResp = await fetch(`/api/getArgument/${params[0]}`, { method: 'GET' });
        argument = await editArgumentResp.json();
    }
  return {
    chunks: ['editArgument'],
    title: argument ? ('Редагування: ' + argument.PageTitle) : 'Нова стаття',
    component: (
      <Layout>
        <EditArgument data={argument || {}} fetch={fetch} />
      </Layout>
    ),
  };
}

export default action;
