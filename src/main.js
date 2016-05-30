/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */
'use strict';
import Proxy from './proxy'

export default {
  Proxy: Proxy,
  createServer: function(opts) {
    return new Proxy(opts)
  },
}
