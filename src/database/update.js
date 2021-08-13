import {rdb} from '../firebase'
import initialData from '../data/initial-data'

export default function update(){
    rdb.ref().set(
        initialData
    );
    
}