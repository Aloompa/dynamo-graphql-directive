import {create} from './create';
import {destroy} from './destroy';
import {get} from './get';
import {scan} from './scan';
import {update} from './update';

export const resolverTypes = {
  scan,
  get,
  create,
  update,
  destroy,
};
