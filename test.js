function convert(obj, ret = "{") {
  function check(v) {
    if (typeof v === "function") v = v.toString();
    else if (typeof v === "object") v = convert(v);
    else if (typeof v == "boolean" || Number.isInteger(v)) v = v;
    else v = `"${v}"`;
    return v;
  }

  if (obj instanceof Array) {
    ret = "[";
    obj.forEach((v) => {
      ret += check(v) + ",";
    });
    ret += "\n]";
  } else {
    for (let k in obj) {
      let v = obj[k];
      ret += `\n  ${k}: ${check(v)},`;
    }
    ret += "\n}";
  }
  return ret;
}

function anyToString(valueToConvert) {
  if (valueToConvert == undefined || valueToConvert === null) {
    return valueToConvert == undefined ? "undefined" : "null";
  }
  if (typeof valueToConvert == "string") {
    return `'${valueToConvert}'`;
  }
  if (
    typeof valueToConvert == "number" ||
    typeof valueToConvert == "boolean" ||
    typeof valueToConvert == "function"
  ) {
    return valueToConvert.toString();
  }
  if (valueToConvert instanceof Array) {
    const stringfiedArray = valueToConvert
      .map((property) => anyToString(property))
      .join(",");
    return `[${stringfiedArray}]`;
  }
  if (typeof valueToConvert === "object") {
    const stringfiedObject = Object.entries(valueToConvert)
      .map((entry) => {
        return `${entry[0]}: ${anyToString(entry[1])}`;
      })
      .join(",");
    return `{${stringfiedObject}}`;
  }
  return JSON.stringify(valueToConvert);
}
