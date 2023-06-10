import { Observable, Subscriber } from "rxjs";

function csvJSON(csv: any) {
  var lines: any[] = csv.split("\n");
  var result: any = [];

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj: any = {};
    var currentLine = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      if (currentLine[j] && currentLine[j]?.trim().length)
        obj[headers[j].trim()] = currentLine[j].replace(/(\r\n|\n|\r)/gm, "");
    }
    if (Object.keys(obj).length > 0) result.push(obj);
  }

  return result;
}

export function uploadCsv(file: any): Observable<any> {
  const reader = new FileReader();
  reader.readAsText(file.files[0]);
  return Observable.create((observer: Subscriber<any[]>): void => {
    reader.onload = () => {
      let text: any = reader.result;
      var json = csvJSON(text);
      observer.next(json);
      observer.complete();
    };
  });
}
