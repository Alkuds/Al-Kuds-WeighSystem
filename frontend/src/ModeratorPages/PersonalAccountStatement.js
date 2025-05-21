import { useClientContext } from "../hooks/useClientContext";
import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { TableContainer } from "@mui/material";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";

const Row = ({ row, key }) => {
  const [purchasingNotesTable, setPurchasingNotesTable] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell className="!text-right border-[0.8px] border-black">
          {" "}
          <div className="flex gap-4 items-center ">
            <p className="text-xl ">ملاحظات الشراء</p>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setPurchasingNotesTable(!purchasingNotesTable)}
            >
              {purchasingNotesTable ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </div>
        </TableCell>
        <TableCell className="!text-right border-[0.8px] border-black">
          {row.name}
        </TableCell>
      </TableRow>
      <TableRow style={{ verticalAlign: "baseline" }}>
        <TableCell
          className="border-[0.8px] border-black"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={purchasingNotesTable} timeout="auto" unmountOnExit>
            <Box>
              {row.purchasingNotes.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        الكمية
                      </TableCell>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        التاريخ
                      </TableCell>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        الملاحظات
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.purchasingNotes.length > 0 &&
                      row.purchasingNotes.map((el, index) => (
                        <TableRow key={index}>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.amount}
                          </TableCell>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.date}
                          </TableCell>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xl text-center py-5">
                  لا توجد ملاحظات شراء متاحة.
                </p>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PersonalAccountStatement = () => {
  const { client, dispatch: clientUpdate } = useClientContext();

  if (client == null) {
    return <div> Loading....</div>;
  }
  const clientArray = Object.values(client);
  const filteredClients = clientArray.filter((c) => c.isKudsPersonnel);

  return (
    <div dir="rtl">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell className="!text-start border-[0.8px] border-black">
                ملاحظات الشراء
              </TableCell>
              <TableCell className="!text-start border-[0.8px] border-black">
                الأسم
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((el) => {
              return <Row row={el} key={el.id} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PersonalAccountStatement;
