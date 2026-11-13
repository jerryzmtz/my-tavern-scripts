<<<<<<< HEAD
import { defineMvuDataStore } from '@/util/mvu';
=======
import { defineMvuDataStore } from '@util/mvu';
>>>>>>> fbd0c2c5f019bec7ca3a145029527629c529b4b3
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
