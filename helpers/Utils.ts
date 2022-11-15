export const formatDate = (date:any) => {
    let d:any = new Date(date);
    var dd = d.getDate();
    var mm = d.getMonth() + 1; //January is 0!
    var yyyy = d.getFullYear();
    d = mm + '/' + dd + '/' + yyyy;
    return d;
};
export const formatFullDate = (date:any) => {
  let d:any = new Date(date);
    var dd = d.getDate();
    var mm = d.getMonth() + 1; //January is 0!
    var yyyy = d.getFullYear();
    var hours = d.getHours();
    var minutes = "0" + d.getMinutes();
    var seconds = "0" + d.getSeconds();
    d = mm + '/' + dd + '/' + yyyy + " "+hours +":" +minutes.substr(-2) + ":" +seconds.substr(-2);
    return d;
}