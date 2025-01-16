
/*  form2obj(form): A simple version for kortgebyr.dk */
function form2obj(form) {
    const obj = {};
    for (let i = 0; i < form.elements.length; i++) {
        const e = form.elements[i];
        if (!e.name || (e.type === 'radio' && !e.checked)) { continue; }
        if (e.type === 'checkbox') {
            const name = e.name.slice(0, -2);
            if (!obj[name]) { obj[name] = {}; }
            if (e.checked) { obj[name][e.value] = 1; }
        } else {
            obj[e.name] = (e.type === 'number' || e.type === 'range') ? e.value | 0 : e.value;
        }
    }
    return obj;
}

/*  obj2form(obj): A simple version for kortgebyr.dk */
/*
function obj2form(o, form) {
    for (let i = 0; i < form.elements.length; i++) {
        const e = form.elements[i];
        if (e.name) {
            if (e.type === 'checkbox') {
                e.checked = !!o[e.name.slice(0, -2)][e.value];
            } else {
                e.value = o[e.name];
            }
        }
    }
}
*/

function sum(obj) {
    let ret = new Currency();
    for (const fee in obj) {
        ret = ret.add(obj[fee]);
    }
    return ret;
}

function merge(...args) {
    const obj = {};
    for (let i = 0; i < args.length; i++) {
        const costobj = args[i];
        for (const z in costobj) {
            if (obj[z]) {
                obj[z] = obj[z].add(costobj[z]);
            } else {
                obj[z] = costobj[z];
            }
        }
    }
    return obj;
}
