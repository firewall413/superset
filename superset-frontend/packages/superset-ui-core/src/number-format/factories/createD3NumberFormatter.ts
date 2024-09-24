/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  format as d3Format,
  formatLocale,
  FormatLocaleDefinition,
} from 'd3-format';
import { isRequired } from '../../utils';
import NumberFormatter from '../NumberFormatter';
import { NumberFormatFunction } from '../types';


function formatBytesAdaptive(value: number): string {
  let formattedValue: number;
  let unit: string;

  if (value >= 2 ** 60) {
    formattedValue = value / (2 ** 60);
    unit = 'EiB';
  } else if (value >= 2 ** 50) {
    formattedValue = value / (2 ** 50);
    unit = 'PiB';
  } else if (value >= 2 ** 40) {
    formattedValue = value / (2 ** 40);
    unit = 'TiB';
  } else if (value >= 2 ** 30) {
    formattedValue = value / (2 ** 30);
    unit = 'GiB';
  } else if (value >= 2 ** 20) {
    formattedValue = value / (2 ** 20);
    unit = 'MiB';
  } else if (value >= 2 ** 10) {
    formattedValue = value / (2 ** 10);
    unit = 'KiB';
  } else {
    formattedValue = value;
    unit = 'B';
  }

  return `${d3Format('.3s')(formattedValue)} ${unit}`;
}


export default function createD3NumberFormatter(config: {
  description?: string;
  formatString: string;
  label?: string;
  locale?: FormatLocaleDefinition;
}) {
  const {
    description,
    formatString = isRequired('config.formatString'),
    label,
    locale,
  } = config;

  let formatFunc: NumberFormatFunction;
  let isInvalid = false;

  try {
    if (formatString === 'bytes-iec-adaptive') {
      formatFunc = formatBytesAdaptive;
    } else {
      formatFunc =
        typeof locale === 'undefined'
          ? d3Format(formatString)
          : formatLocale(locale).format(formatString);
    }
  } catch (error) {
    formatFunc = value => `${value} (Invalid format: ${formatString})`;
    isInvalid = true;
  }

  return new NumberFormatter({
    description,
    formatFunc,
    id: formatString,
    isInvalid,
    label,
  });
}
