import {create} from './create';
import {destroy} from './destroy';
import {get} from './get';
import {query} from './query';
import {scan} from './scan';
import {update} from './update';

export const resolverTypes = {
  scan,
  get,
  create,
  update,
  destroy,
  query,
};
