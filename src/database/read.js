import {rdb} from '../firebase'
import initialData from '../initial-data'

export default function update(){
    rdb.ref().set(
        initialData
    );
    
}