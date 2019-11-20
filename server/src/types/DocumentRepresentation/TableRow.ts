/**
 * Copyright 2019 AXA Group Operations S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BoundingBox } from './BoundingBox';
import { Element } from './Element';
import { TableCell } from './TableCell';

export class TableRow extends Element {
  private _content: TableCell[];

  constructor(cells: TableCell[], boundingBox: BoundingBox) {
    super(boundingBox);
    this.content = cells;
  }

  /**
   * Getter cells
   * @return {TableCell[]}
   */
  public get content(): TableCell[] {
    return this._content;
  }

  /**
   * Setter cells
   * @param {TableCell[]} value
   */
  public set content(value: TableCell[]) {
    this._content = value;
  }

  /**
   * Converts the entire row into a md code string.
   */
  public toMarkdown(type?: string): string {
    if (type === 'html') {
      return this.exportAsHtml();
    }

    return this.exportAsMD();
  }

  public exportAsHtml(): string {
    let output: string = "<tr style='background-color:#fff'>  \n";
    this.content.forEach(cell => {
      output += cell.toMarkdown();
    });
    return output + '</tr>';
  }

  public exportAsMD(): string {
    let output: string = '|';
    this.content.forEach(cell => {
      output += cell.toMarkdown() + '|';
    });
    return output;
  }

  public mergeCells(colIdxGroups: number[][]): TableRow {
    colIdxGroups.forEach(colIdxGroup => {
      const cellsToJoin = this.content.filter((_, i) => colIdxGroup.includes(i));
      const joinedCell = cellsToJoin[0];
      cellsToJoin.slice(1).forEach(cell => {
        joinedCell.box.width += cell.box.width;
        joinedCell.content.push(...cell.content);
        joinedCell.colspan += 1;
        cell.box.width = 0;
      });
    });

    this.content = this.content.filter(c => c.box.width > 0);
    return this;
  }
}
