/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { formatMetric } from '../../../lib/format_number';
import { ClusterStatus } from '../cluster_status';
import { EuiMonitoringTable } from '../../table';
import {
  EuiPage,
  EuiPageContent,
  EuiPageBody,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';

const columns = [
  {
    name: i18n.translate('xpack.monitoring.elasticsearch.indices.unassignedShardsTitle', {
      defaultMessage: 'Unassigned Shards',
    }),
    field: 'unassigned_shards',
    sortable: true,
    render: value => (
      <div data-test-subj="unassignedShards">
        {formatMetric(value, '0')}
      </div>
    )
  }
];

const getNoDataMessage = () => {
  return (
    <div>
      <p>
        <FormattedMessage
          id="xpack.monitoring.elasticsearch.tasks.noTasksMatchYourSelectionDescription"
          defaultMessage="No tasks available to show."
        />
      </p>
    </div>
  );
};

export const ElasticsearchTasks = ({
  cStatus,
  tasks,
}) => {
  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPanel>
          <ClusterStatus stats={cStatus} />
        </EuiPanel>
        <EuiSpacer size="m" />
        <EuiPageContent>
          <EuiSpacer size="m"/>
          <EuiMonitoringTable
            className="elasticsearchTasksTable"
            rows={tasks}
            columns={columns}
            message={getNoDataMessage()}
            search={{
              box: {
                incremental: true,
                placeholder: i18n.translate('xpack.monitoring.elasticsearch.tasks.monitoringTablePlaceholder', {
                  defaultMessage: 'Filter Tasks…'
                })
              },
            }}
          />
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
