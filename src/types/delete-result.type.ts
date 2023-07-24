import { Model } from 'mongoose';

type DeleteFunction = typeof Model.deleteOne;
export type DeleteResult = Awaited<ReturnType<DeleteFunction>>;
