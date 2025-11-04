-- Insertar productos de ejemplo si no existen
IF NOT EXISTS (SELECT 1 FROM Products)
BEGIN
    INSERT INTO Products (Id, Name, Description, Price, Stock, Category, IsActive, CreatedAt, LastUpdatedAt)
    VALUES 
    (NEWID(), 'Pizza Margherita', 'Pizza clásica con tomate, mozzarella y albahaca', 12.99, 50, 'Pizza', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Hamburguesa Clásica', 'Hamburguesa con carne, lechuga, tomate y queso', 8.99, 30, 'Hamburguesa', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Coca Cola 500ml', 'Bebida gaseosa sabor cola', 2.50, 100, 'Bebida', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Ensalada César', 'Ensalada fresca con pollo, crutones y aderezo césar', 7.99, 25, 'Ensalada', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Papas Fritas', 'Papas fritas crujientes con sal', 3.99, 75, 'Acompañamiento', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Burrito de Pollo', 'Burrito relleno de pollo, frijoles, arroz y verduras', 9.99, 20, 'Mexicano', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Helado de Vainilla', 'Helado cremoso sabor vainilla', 4.50, 15, 'Postre', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Café Americano', 'Café negro americano caliente', 2.99, 60, 'Bebida', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Tacos al Pastor', 'Tres tacos de cerdo al pastor con piña', 10.99, 40, 'Mexicano', 1, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'Agua Mineral', 'Agua mineral embotellada 600ml', 1.50, 150, 'Bebida', 1, GETUTCDATE(), GETUTCDATE());
    
    PRINT 'Productos insertados correctamente';
END
ELSE
BEGIN
    PRINT 'Los productos ya existen en la base de datos';
END
