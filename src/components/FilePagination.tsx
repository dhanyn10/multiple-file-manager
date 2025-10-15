import { Row, Col, Form, Pagination } from 'react-bootstrap';

interface FilePaginationProps {
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  pageCount: number;
  currentPage: number;
}

const FilePagination = ({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  pageCount,
  currentPage,
}: FilePaginationProps) => {
  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= pageCount; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <Row className="mt-3 flex-shrink-0 align-items-center">
      <Col xs="auto">
        <Form.Group as={Row} className="align-items-center gx-2">
          <Form.Label column xs="auto">Show:</Form.Label>
          <Col xs="auto">
            <Form.Select style={{ width: '80px' }} value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Select>
          </Col>
        </Form.Group>
      </Col>
      <Col>{pageCount > 1 && <Pagination className="justify-content-end mb-0">{renderPaginationItems()}</Pagination>}</Col>
    </Row>
  );
};

export default FilePagination;