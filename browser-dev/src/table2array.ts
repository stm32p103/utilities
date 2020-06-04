export function table2array( table: HTMLTableElement ) {
    let rowSkips: number[] = [];        // 1つ上の行基準のrowSpanの高さ。> 0 ならスキップが必要。
    const tableData: string[][] = [];

    for( let i = 0; i < table.rows.length; i++ ) {
        const rowElement = table.rows[ i ];
        const rowCellCount = countColumns( rowElement );

        // 空行の場合は、前の行と同じセル数のnullを返す
        if( rowCellCount == 0 ) {
            rowSkips = rowSkips.map( skip => Math.max( 0, skip - 1 ) );
            tableData.push( new Array( tableData[ tableData.length - 1 ].length ).fill( null ) );
            break;
        }

        // データ数の算出
        const dataCount = rowCellCount + rowSkips.reduce( (prev, cur) => ( cur > 0 ) ? prev + 1 : prev, 0 );

        // 行のデータを空配列
        const rowData: string[] = new Array( dataCount ).fill( null );

        // skip数の配列拡張
        const shortage = dataCount - rowSkips.length;
        if( shortage > 0 ) {
            rowSkips = rowSkips.concat( new Array( shortage ).fill( 0 ) );
        }

        // 行のデータ作成
        let column = 0;
        for( let j = 0; j < rowElement.cells.length; j++ ) {
            // colspan/rowspan 取得
            const rowSkip = Math.max( Number( rowElement.cells[ j ].rowSpan ), 1 ) - 1;
            const columnSkip = Math.max( Number( rowElement.cells[ j ].colSpan ), 1 ) - 1;

            // 上の行の rowspan をスキップ
            while( rowSkips[ column ] > 0 ) {
                rowSkips[ column ]--;
                rowData[ column ] = null;
                column++;
            }

            // j 番目のセルの値を追加
            rowSkips[ column ] = rowSkip;
            rowData[ column ] = rowElement.cells[ j ].innerHTML;
            column++;

            // j 番目のセルの colspan をスキップ
            for( let skip=0; skip < columnSkip; skip++ ) {
                rowSkips[ column ] = rowSkip;
                rowData[ column ] = null;
                column++;
            }

            // 上の行の rowspan をスキップ
            while( rowSkips[ column ] > 0 ) {
                rowSkips[ column ]--;
                rowData[ column ] = null;
                column++;
            }
        }
        // 行のデータを保存
        tableData.push( rowData );
    }
    return tableData;
}

function countColumns( row: HTMLTableRowElement) {
    let sum = 0;
    for( let i=0; i<row.cells.length; i++ ) {
        sum += row.cells[i].colSpan;
    }
    return sum;
}
