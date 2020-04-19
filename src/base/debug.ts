export class Debug {
  private static items = new Map<string, string>();
  private static el: Element | undefined;

  static record(label: string, val: any) {
    const stringVal = JSON.stringify(val, null, 2);
    Debug.items.set(label, stringVal);
  }

  static measure(label: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();

    this.record(label, `${Math.floor(end - start)}ms`);
  }

  private static getHtml(): Element {
    const root = document.createElement("table");
    root.className = "debug";
    Debug.items.forEach((val, label) => {
      const row = document.createElement("tr");
      const title = document.createElement("td");
      title.innerText = label;
      const content = document.createElement("td");
      const pre = document.createElement("pre");
      pre.innerText = val;
      content.appendChild(pre);
      row.appendChild(title);
      row.appendChild(content);
      root.appendChild(row);
    });

    return root;
  }

  static update() {
    const newDebug = Debug.getHtml();
    if (this.el) {
      this.el.replaceWith(newDebug);
    } else {
      document.body.appendChild(newDebug);
    }
    this.el = newDebug;
  }
}
