let API_URI = '';

console.log("process.env.NODE_ENV : "+process.env.NODE_ENV);

if(process.env.NODE_ENV === 'production'){

    API_URI = 'https://summerpool.herokuapp.com';
    console.log("Got a Dev URI");


}else{

    API_URI = 'https://shrouded-gorge-90372.herokuapp.com';
    console.log("Got a Dev URI");

}

console.log('API_URI => '+API_URI);
export default API_URI;
