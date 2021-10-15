import { ApiEndpoint } from '../types/ApiEndpoint';
import { SoknadApiData } from '../types/SoknadApiData';
import api from './api';

export const sendEndringsmelding = (data: SoknadApiData) => api.post(ApiEndpoint.sendEndringsmelding, data);
