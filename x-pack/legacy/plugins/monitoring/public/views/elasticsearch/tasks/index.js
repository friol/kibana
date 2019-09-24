/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { find } from 'lodash';
import uiRoutes from 'ui/routes';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import { MonitoringViewBaseEuiTableController } from '../../';
import { ElasticsearchTasks } from '../../../components';

import template from './index.html';
import { I18nContext } from 'ui/i18n';
import { CODE_PATH_ELASTICSEARCH } from '../../../../common/constants';

uiRoutes.when('/elasticsearch/tasks', {
  template,
  resolve: {
    clusters(Private) {
      const routeInit = Private(routeInitProvider);
      return routeInit({ codePaths: [CODE_PATH_ELASTICSEARCH] });
    }
  },
  controllerAs: 'elasticsearchTasks',
  controller: class ElasticsearchTasksController extends MonitoringViewBaseEuiTableController {
    constructor($injector, $scope) {
      const $route = $injector.get('$route');
      const globalState = $injector.get('globalState');
      //const features = $injector.get('features');

      const { cluster_uuid: clusterUuid } = globalState;
      $scope.cluster = find($route.current.locals.clusters, { cluster_uuid: clusterUuid });

      super({
        title: i18n.translate('xpack.monitoring.elasticsearch.tasks.routeTitle', {
          defaultMessage: 'Elasticsearch - Tasks'
        }),
        storageKey: 'elasticsearch.tasks',
        apiUrlFn: () => `../api/monitoring/v1/clusters/${clusterUuid}/elasticsearch/tasks`,
        reactNodeId: 'elasticsearchTasksReact',
        defaultData: {},
        $scope,
        $injector,
        $scope,
        $injector
      });

      this.isCcrEnabled = $scope.cluster.isCcrEnabled;

      $scope.$watch(() => this.data, data => {
        this.renderReact(data);
      });

      this.renderReact = ({ clusterStatus, tasks }) => {
        super.renderReact(
          <I18nContext>
            <ElasticsearchTasks cStatus={clusterStatus} tasks={tasks} />
          </I18nContext>
        );
      };
    }
  }
});
