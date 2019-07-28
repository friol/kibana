/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { uiModules } from 'ui/modules';
import { npStart } from 'ui/new_platform';
import { TelemetryOptInProvider } from '../../../../../../x-pack/legacy/plugins/telemetry/public/services/telemetry_opt_in';
import { createUiStatsReporter, METRIC_TYPE } from '../../../ui_metric/public';
export let indexPatternService;
export const telemetryService = {};

export const trackUiMetric = createUiStatsReporter('Kibana_home');
export { METRIC_TYPE };

uiModules.get('kibana').run(($injector) => {
  indexPatternService = $injector.get('indexPatterns');
  const Private = $injector.get('Private');
  const telemetryOptInProvider = Private(TelemetryOptInProvider);
  const telemetryEnabled = npStart.core.injectedMetadata.getInjectedVar('telemetryEnabled');
  const telemetryBanner = npStart.core.injectedMetadata.getInjectedVar('telemetryBanner');
  telemetryService.telemetryEnabled = telemetryEnabled;
  telemetryService.telemetryBanner = telemetryBanner;
  telemetryService.telemetryOptInProvider = telemetryOptInProvider;
});
