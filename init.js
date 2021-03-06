//init.js
//basic functions and variables that are used in the whole site

//parse the strings into numbers in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].height = parseFloat(json_rockets.rockets[i].height);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].payload_leo = parseInt(json_rockets.rockets[i].payload_leo);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].payload_gto = parseInt(json_rockets.rockets[i].payload_gto);
}
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].cost = parseInt(json_rockets.rockets[i].cost);
}
//parse the strings into bools in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].high_res = json_rockets.rockets[i].high_res === '1';
}
//parse the strings into dates in the json array
for (var i = 0; i < json_rockets.rockets.length; i++) {
    json_rockets.rockets[i].date = new Date(json_rockets.rockets[i].date);
}

//height, family, date, payload, cost
var sorting_args = [['height', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['type', 'country', 'manufacturer', 'family', 'name', 'version'],
    ['date', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['payload_leo', 'payload_gto', 'type', 'country', 'family', 'manufacturer', 'name', 'version'],
    ['cost', 'type', 'country', 'family', 'manufacturer', 'name', 'version']];

//other stuff
var init = true;
var stupid_unit_system = false;
var enable_dark_theme = false;
var use_high_res = false;
var rocket_comp_height = 86;



//basic functions
//checks if elem can be viewed in doc
function isScrolledIntoView(elem, doc)
{
    var doc_rect = doc.getBoundingClientRect();
    var doc_top = doc_rect.top;
    var doc_bottom = doc_rect.bottom;

    var elem_rect = elem.getBoundingClientRect();
    var elem_top = elem_rect.top;
    var elem_bottom = elem_rect.bottom;

    return (elem_bottom > 0);
}

//detects mobile browsers
function detect_small_browser(){
    if(window.innerWidth <= 900) {
        return true;
    }
    return false;
}

//set cookie name to value
function set_cookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));

    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}
function get_cookie(name) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i <cookies.length; i++) {
        var curr_cookie = cookies[i].split('=');
        var curr_name = curr_cookie[0].split(' ').join('');

        if (curr_name === name) {
            return curr_cookie[1];
        }
    }
    return "";
}
//delete cookie with name
function delete_cookie(name) {
    var d = new Date();
    d.setTime(0);

    document.cookie = name + "=;expires=" + d.toUTCString() + ";path=/";
}

//creates a text node at level with text
function create_text_node(text, level, class_name = ''){
    var curr_node;
    if(level > 0){
        curr_node = document.createElement('h' + level);
    }
    else {
        curr_node = document.createElement('p');
    }
    curr_node.className = class_name;
    curr_node.appendChild(document.createTextNode(text));
    return curr_node;
}
//creates a link with text
function create_link(text, link){
    var link_p = document.createElement('p');

    if(link != ''){
        var link_text = document.createElement('a');
        link_text.href = link;
        link_text.appendChild(document.createTextNode(text));

        link_p.appendChild(link_text);
    }
    else {
        link_p.appendChild(document.createTextNode(text));
    }
    return link_p;
}
//takes a rocket, returns an id
function get_id(rocket){
    var path = rocket.path;
    var path_array = path.split('/');
    return path_array[path_array.length - 1].split('.png')[0];
}

//takes a rocket, returns an id
function get_full_name(rocket){
    return rocket.name + ' ' + rocket.version;
}

//finds_biggest_rocket
function find_biggest_rocket(){
    var biggest_rocket_height = 0.1;
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        if(selected_rockets.rockets[i].height > biggest_rocket_height){
            biggest_rocket_height = selected_rockets.rockets[i].height;
        }
    }
    return biggest_rocket_height;
}
//finds_biggest_rocket
function find_biggest_payload(orbit = 'leo'){
    var payload = 'payload_' + orbit;
    var biggest_payload = 1;
    for (var i = 0; i < selected_rockets.rockets.length; i++) {
        if(selected_rockets.rockets[i][payload] > biggest_payload){
            biggest_payload = selected_rockets.rockets[i][payload];
        }
    }
    return biggest_payload;
}

//returns i where json_rockets.rockets[i] === rocket
function find_rocket_num(rocket){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if(json_rockets.rockets[i] === rocket){
            return i;
        }
    }
}
//returns the rocket with the id rocket_id
function find_rocket(rocket_id){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        var curr_rocket_id = get_id(json_rockets.rockets[i]);

        if(curr_rocket_id === rocket_id){
            return json_rockets.rockets[i];
        }
    }
}

//adds every rocket where parameter === value
function add_rocket(parameter, value){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if (json_rockets.rockets[i][parameter] === value) {
            var id = get_id(json_rockets.rockets[i]);
            force_activate_rocket(id);
        }
    }

    update_rockets();
    update_background_dimensions();
}
//removes every rocket where parameter === value
function remove_rocket(parameter, value){
    for (var i = 0; i < json_rockets.rockets.length; i++) {
        if (json_rockets.rockets[i][parameter] === value) {
            var id = get_id(json_rockets.rockets[i]);
            force_deactivate_rocket(id);
        }
    }

    update_rockets();
    update_background_dimensions();
}

function check_object_for_parameters(object, param_array){
    for (var i = 0; i < param_array.length; i++) {
        var parameter = param_array[i][0];
        var curr_value = object[parameter];

        if(param_array[i].length === 2){
            var value = param_array[i][1];
            if (curr_value != value) {
                return false;
            }
        }
        else if(param_array[i].length === 3){
            var min = param_array[i][1];
            var max = param_array[i][2];
            if (curr_value < min || curr_value > max) {
                return false;
            }
        }
    }
    return true;
}
//returns an array where each object meet all the requirements
//param_array = [[param1, value1], [param2, min2, max2]];
function get_rockets_multiple_param(param_array, add){
    var correct_objects = JSON.parse('{"rockets" :[]}');

    //if there are no condition, return empty
    if(param_array.length <= 0){
        return correct_objects;
    }

    for (var i = 0; i < json_rockets.rockets.length; i++) {
        var curr_rocket = json_rockets.rockets[i];

        if(check_object_for_parameters(curr_rocket, param_array)){
            var is_active = check_if_rocket_is_active(get_id(curr_rocket), false);
            if((add && !is_active) || (!add && is_active)){
                correct_objects.rockets.push(curr_rocket);
            }
        }
    }

    return correct_objects;
}


//sorting stuff
//compare 2 objects
function compare_args(arg1, arg2){
    //string comparison using > and < is fucked up, use this instead
    if(isNaN(arg1)){
        var comp = arg1.localeCompare(arg2);
        return comp;
    }
    if(arg1 != arg2){
        //put -1 last
        if(arg1 === -1){
            return 1;
        }
        else if(arg2 === -1){
            return -1;
        }

        if(arg1 > arg2){
            return 1;
        }
        return -1;
    }
    return 0
}
var use_descending_order = false;
//sorts the rockets according to the arguments in the array args, ascending or descending
function sort_rockets(args, descending){
    return function(a, b){
        var sort_order_mod = 1;
        if(descending){
            sort_order_mod = -1;
        }

        for (var i = 0; i < args.length; i++) {
            var curr_a_arg = a[args[i]];
            var curr_b_arg = b[args[i]];

            curr_comp = compare_args(curr_a_arg, curr_b_arg);
            if(curr_comp != 0){
                return curr_comp * sort_order_mod;
            }
        }

        //if completely equal
        return 0;
    }
}



//loads the stylesheet
function load_stylesheet(source){
    var stylesheet_node = document.createElement('link');
    stylesheet_node.rel = 'stylesheet';
    stylesheet_node.type = 'text/css';
    stylesheet_node.href = source;

    var head_node = document.getElementsByTagName('head')[0];
    head_node.appendChild(stylesheet_node);
}
//unloads the stylesheet
function unload_stylesheet(filename){
    var link_list = document.getElementsByTagName('link');

    for (var i = 0; i < link_list.length; i++) {
        if(link_list[i].getAttribute('href').indexOf(filename) != -1){
            link_list[i].parentNode.removeChild(link_list[i]);
            return;
        }
    }
}



//returns the path to the image with the right resolution
function get_correct_res_path(rocket){
    if(!use_high_res && rocket.high_res){
        var low_res_path_table = rocket.path.split('/');
        low_res_path_table[low_res_path_table.length -1] = 'l-' + low_res_path_table[low_res_path_table.length -1];
        return low_res_path_table.join('/');
    }
    return rocket.path;
}


function get_manufacturer(rocket){
    if(rocket.type === 'Other' || rocket.type === 'Stations' || rocket.country === 'USA' || rocket.country === 'USSR / Russia' || rocket.country === 'Europe' || rocket.country === 'Other'){
        return rocket.manufacturer
    }

    return rocket.country;
}

function get_status(rocket){
    return rocket.status;
}

//obvious, also adds commas because you're going to get huge numbers with this stupid system
function kg_to_pounds(good_unit){
    var bad_unit = good_unit*2.2046;
    return Math.round(bad_unit).toLocaleString();
}

//returns a useable date strings
function get_date_string(rocket, add_text = false){
    var date = rocket.date;
    var date_year = date.getFullYear();

    //default year for very old stuff, date should not be displayed
    if(date_year === 100){
        return '';
    }

    var text = rocket.type === 'Rockets' || rocket.type === 'Spacecraft'? 'First launch: ' : (rocket.type != 'Other'? 'launch: ' : '');
    var additional_text = (add_text)? text : '';

    var today = new Date();
    var current_year = today.getFullYear();

    var date_day = date.getDate();
    var date_month = date.getMonth();
    //if date is in future or is january 1st, it is unknown and only year should be displayed
    if(date_year > current_year || (date_day === 1 && date_month === 0)){
        if(rocket.status === 'Cancelled'){
            return 'Never launched';
        }
        return additional_text + date_year;
    }

    var months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    return additional_text + months[date_month] + ' ' + date_day + ' ' + date_year;
}

//returns the cost in K/M/B
function get_cost_string(rocket, add_text = false){
    var cost = rocket.cost;
    if(cost === -1){
        return '';
    }

    var mult_array = ['', 'K', ' million', ' billion'];
    var n = 0;

    while (cost >= 1000) {
        cost /= 1000;
        n++;
    }

    var cost_string = '$' + cost + mult_array[n];

    var additional_text = rocket.type === 'Rockets' || rocket.type === 'Spacecraft'? 'Launch cost: ' : 'Cost: ';
    return (add_text? additional_text : '') + cost_string;
}

//raw_payload: payload in kg. outputs a shorter number or a longer one if you like stupid unit systems.
function get_payload_correct_unit(raw_payload){
    if(raw_payload < 1){
        return '';
    }

    if(stupid_unit_system){
        return kg_to_pounds(raw_payload) + 'lb';
    }

    if(raw_payload > 1000){
        return Math.round(raw_payload/1000 * 10) / 10 + 't';
    }
    return raw_payload + 'kg';
}
//outputs the correct payload depending on row and type
function get_payload_cell(rocket, curr_row, add_text = false){
    var payload_to_gto = get_payload_correct_unit(rocket.payload_gto);

    if(curr_row != 'gto'){
        switch (rocket.payload_type) {
            case 'Crew':
                return (rocket.payload_leo > 0)? 'Crew: ' + rocket.payload_leo : '';
                break;

            case 'Mass':
                break;

            case 'No':
                return '';
                break;

            default:
                return rocket.payload_type;
                break;
        }

        var payload_to_leo = get_payload_correct_unit(rocket.payload_leo);

        if(rocket.type === 'Rockets' && rocket.payload_leo === 0){
            return 'Suborbital Rocket';
        }

        if(curr_row === 'basic' && payload_to_leo === '' && payload_to_gto != ''){
            return payload_to_gto + ' (GTO)';
        }

        return (add_text && payload_to_leo != '' ? 'Payload to LEO: ' : '') + payload_to_leo + (curr_row === 'basic' && payload_to_leo != ''? ' (LEO)' : '');
    }

    return (add_text && payload_to_gto != '' ? 'Payload to GTO: ' : '') + payload_to_gto;
}


//retun the number of sub-categories present in the category
function sub_categories_in_category(rocket_num, level) {
    var categories = ['manufacturer', 'family', 'name', 'version'];
    var curr_category = json_rockets.rockets[rocket_num][categories[level]];
    var sub_categories = 1;
    var curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]

    while (rocket_num < json_rockets.rockets.length && json_rockets.rockets[rocket_num][categories[level]] === curr_category) {
        if(curr_sub != json_rockets.rockets[rocket_num][categories[level + 1]]){
            curr_sub = json_rockets.rockets[rocket_num][categories[level + 1]]
            sub_categories++;
        }
        rocket_num++;
    }
    return sub_categories;
}
//retun the number of elements present in the category
function elements_in_category(rocket_num, level) {
    var categories = ['manufacturer', 'family', 'name', 'version'];
    var curr_category = json_rockets.rockets[rocket_num][categories[level]];
    var elements = 1;

    while (rocket_num < json_rockets.rockets.length && json_rockets.rockets[rocket_num][categories[level]] === curr_category) {
        elements++;
        rocket_num++;
    }
    return elements;
}
