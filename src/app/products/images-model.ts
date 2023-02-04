import {FileHandle} from './file-handle'

export interface IImageModel{
    Id: number;
    Name: string;
    Type: string;
    PicByte:string;
    ProductId: number
    fileHandle: FileHandle;
    Url: string;
}