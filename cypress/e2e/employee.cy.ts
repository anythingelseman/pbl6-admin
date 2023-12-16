describe('Test create new employee', () => {
  before(() => {
    //cy.loginAdmin();
  });

  beforeEach(() => {
    cy.loginAdmin();
  });

  it('CE1: Tên bị để trống', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`nguyenvana@${numberRandom}`);
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=password]').type(`vana${numberRandom}`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Please fill in all the fields').should('exist');
  });


  it('CE2: email bị để trống', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.get('input[name=password]').type(`vana${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Please fill in all the fields').should('exist');
  });

  it('CE3: username bị để trống', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`nguyenvana${numberRandom}@gmail.com`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=password]').type(`vana${numberRandom}`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Please fill in all the fields').should('exist');
  });

  // it('Thêm CK1: phone number bị để trống', () => {
  //   cy.visit('http://localhost:3000/manage/employee');
  //   cy.wait(5000);

  //   cy.contains('Add employee').click(); // open model thêm chuyên khoa
  //   cy.wait(100);
  //   var numberRandom = Math.random().toString().slice(2, 6);
  //   cy.get('input[name=name]').type('Nguyen van a');
  //   cy.get('input[name=address]').type('Da Nang');
  //   cy.get('input[name=email]').type(`nguyenvana${numberRandom}@gmail.com`);
  //   cy.get('input[name=password]').type(`vana${numberRandom}`);
  //   cy.get('input[name=birthday]').type('2023-12-02');
  //   cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
  //   cy.wait(100);
  //   cy.get('#Add-button').click();

  //   cy.wait(500);
  //   cy.contains('Please fill in all the fields').should('exist');
  // });

  it('CE4: password bị để trống', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`nguyenvana${numberRandom}@gmail.com`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Please fill in all the fields').should('exist');
  });

  it('CE5: trùng email', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`duynguyen@gmail.com`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=password]').type(`vana${numberRandom}`);
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Email already exists in the database.').should('exist');
  });

  it('CE6: trùng username', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`duynguyen${numberRandom}@gmail.com`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=password]').type(`vana${numberRandom}`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=username]').type(`duynguyen`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Username already exists in the database.').should('exist');
  });

  it('CE7: Password must be at least 8 characters.', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type('Nguyen van a');
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`duynguyen${numberRandom}@gmail.com`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=password]').type(`${numberRandom}`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Password must be at least 8 characters.').should('exist');
  });

  it('CE8: Create successfully.', () => {
    cy.visit('http://localhost:3000/manage/employee');
    cy.wait(2000);

    cy.contains('Add employee').click(); // open model thêm chuyên khoa
    cy.wait(100);
    var numberRandom = Math.random().toString().slice(2, 6);
    cy.get('input[name=name]').type(`Nguyen van a ${numberRandom}`);
    cy.get('input[name=address]').type('Da Nang');
    cy.get('input[name=email]').type(`duynguyen${numberRandom}@gmail.com`);
    cy.get('input[name=birthday]').type('2023-12-02');
    cy.get('input[name=password]').type(`1234${numberRandom}`);
    cy.get('input[name=phoneNumber]').type(`123456${numberRandom}`);
    cy.get('input[name=username]').type(`nguyenvana${numberRandom}`);
    cy.wait(100);
    cy.get('#Add-button').click();

    cy.wait(500);
    cy.contains('Add employee successfully').should('exist');
  });


});