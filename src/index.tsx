import * as React from "react";
import * as ReactDOM from "react-dom";

import {Page} from './Cabinet/Page';

ReactDOM.render(<Page compiler="TypeScript" framework="React" />,
                  document.getElementById('main'));
